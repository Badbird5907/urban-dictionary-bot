import { commands } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import { env } from "@/env.mjs"
import {
  APIInteractionDataOptionBase,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"
import { UrbanDictionaryDefinition } from "@/types/urban"

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge"

const ROOT_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.ROOT_URL

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(request, env.DISCORD_APP_PUBLIC_KEY)
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 })
  }
  const { interaction } = verifyResult

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong })
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name } = interaction.data

    switch (name) {
      case commands.ping.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Pong` },
        })

      case commands.invite.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Click [here](https://discord.com/oauth2/authorize?client_id=${env.DISCORD_APP_ID}) to add UrbanDictionary!`,
            flags: MessageFlags.Ephemeral,
          },
        })

      case commands.urban.name:
        if (!interaction.data.options || interaction.data.options?.length < 1) {
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: "Oops! Please enter a query!",
              flags: MessageFlags.Ephemeral,
            },
          })
        }

        const option = interaction.data.options[0]
        // @ts-ignore
        const value = String(option.value).toLowerCase()
        const isPublic = interaction.data.options.length > 1 ? (interaction.data.options[1] as {value: boolean})?.value as boolean : false;

        try {
          const { list }: { list: UrbanDictionaryDefinition[] } = await fetch(`https://api.urbandictionary.com/v0/define?term=${value}`).then((res) => {
            return res.json()
          })
          if (list.length === 0) {
            return NextResponse.json({
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "No definition found",
                flags: isPublic ? undefined : MessageFlags.Ephemeral,
              },
            })
          }
          const definition = list.reduce((prev, curr) => {
            return prev.thumbs_up > curr.thumbs_up ? prev : curr;
          });

          // yoink https://github.com/Vendicated/Vencord/commit/93dc880bc026ad83ff47bddc588d274909a67bff
          const linkify = (text: string) => text
            .replaceAll("\r\n", "\n")
            .replace(/([*>_`~\\])/gi, "\\$1")
            .replace(/\[(.+?)\]/g, (_, word) => `[${word}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)} "Define '${word}' on Urban Dictionary")`)
            .trim();
          let example = definition.example;
          if (example.length > 256) {
            example = example.slice(0, 253) + "...";
          }
          let description = definition.definition;
          if (description.length > 256) {
            description = description.slice(0, 253) + "...";
          }
          const data = {
            embeds: [
              {
                type: "rich",
                title: capitalizeFirstLetter(definition.word),
                description: linkify(description),
                author: {
                  name: `Written by ${definition.author}`,
                  url: definition.permalink,
                },
                url: definition.permalink,
                fields: [
                  {
                    name: "Example",
                    value: linkify(example),
                  },
                ],
                footer: {
                  text: `👍 ${definition.thumbs_up} | 👎 ${definition.thumbs_down}`,
                  icon_url: "https://urbandictionary.fyi/upload/logo1.png",
                },
                color: 0xf1fc47,
                timestamp: new Date(definition.written_on).toISOString(),
              }
            ],
            flags: isPublic ? undefined : MessageFlags.Ephemeral,
          };
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data,
          })
        } catch (error) {
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: "Failed to fetch definition. Please try again later, or join [our support server](https://discord.badbrid.dev/) for help.",
              flags: MessageFlags.Ephemeral,
            },
          })
        }
      default:
      // Pass through, return error at end of function
    }
  }

  return new NextResponse("Unknown command", { status: 400 })
}
