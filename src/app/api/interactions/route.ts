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
import { waitUntil } from "@vercel/functions";
import { getEmbedData } from "@/app/api/interactions/urban"

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge"

const ROOT_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.ROOT_URL


/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(request, env.DISCORD_APP_PUBLIC_KEY)
  if (!verifyResult.isValid || !verifyResult.interaction) {
    console.error("Invalid request", verifyResult)
    return new NextResponse("Invalid request", { status: 401 })
  }
  const { interaction } = verifyResult

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong })
  }

  // @ts-ignore - broken, it works
  if (interaction.type === InteractionType.MessageComponent) {
    const id = (interaction as any).data.custom_id;
    if (!id) {
      return new NextResponse("Invalid request", { status: 400 })
    }
    
    // @ts-ignore - stfu
    const token = interaction.token;
    if (id.startsWith("p:") || id.startsWith("j:") || id.startsWith("r:")) {
      const [_, page, isPublic, sort, isRandom, value] = id.split(":");
      const p = parseInt(page);
      if (isNaN(p) || p < 0) {
        return new NextResponse("Invalid request", { status: 400 })
      }
      waitUntil((async () => {  
        const embed = await getEmbedData(decodeURIComponent(value), isPublic === "true", p, sort, isRandom === "t");
        // PATCH /webhooks/{application.id}/{interaction.token}/messages/@original
        const res = await fetch(`https://discord.com/api/v9/webhooks/${env.DISCORD_APP_ID}/${token}/messages/@original`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...embed,
          }),
        });
        // console.log("patched", res.status, await res.text());
      })())
      return NextResponse.json({
        type: InteractionResponseType.DeferredMessageUpdate,
      })
    } else if (id.startsWith("cs:")) { // change sort
      const [_, isPublic, nextSort, isRandom, value] = id.split(":");
      waitUntil((async () => {
        const embed = await getEmbedData(decodeURIComponent(value), isPublic === "true", 0, nextSort, isRandom === "t");
        await fetch(`https://discord.com/api/v9/webhooks/${env.DISCORD_APP_ID}/${token}/messages/@original`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...embed,
          }),
        });
      })())
      return NextResponse.json({
        type: InteractionResponseType.DeferredMessageUpdate,
      })
    }
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

      case commands.random.name:
      case commands.urban.name:
        let value = ""
        let isPublic = false;
        let isRandom = false;
        if (name === commands.random.name) {
          value = "random"
          isRandom = true;
          isPublic = (interaction.data.options?.length || 0) > 0 ? (interaction.data.options![0] as {value: boolean})?.value as boolean : false;
        } else {
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
          value = String(option.value).toLowerCase()
          isRandom = value === "random";
          isPublic = interaction.data.options.length > 1 ? (interaction.data.options[1] as {value: boolean})?.value as boolean : false;
        }

        try {
          const data = await getEmbedData(value, isPublic, 0, "tu", isRandom)
          if (!data) {
            return NextResponse.json({
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "No definition found",
                flags: isPublic ? undefined : MessageFlags.Ephemeral,
              },
            })
          }
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
