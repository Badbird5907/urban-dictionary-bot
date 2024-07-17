/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#registering-a-command
 */

import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord-api-types/v10"

const PING_COMMAND = {
  name: "ping",
  description: "Ping pong! I'll respond with pong.",
} as const

const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add this bot to your server",
  contexts: [0,1,2],
  integration_types: [0,1],
} as const

const URBAN_COMMAND = {
  name: "urban",
  description: "Get a definition from the Urban Dictionary",
  contexts: [0,1,2],
  integration_types: [0,1],
  options: [
    {
      name: "phrase",
      description: "The phrase you want to look up",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "public",
      description: "Show the definition to everyone?",
      type: ApplicationCommandOptionType.Boolean,
      default: false,
    },
  ],
}

const RANDOM_COMMAND = {
  name: "random",
  description: "Get a random definition from the Urban Dictionary",
  contexts: [0,1,2],
  integration_types: [0,1],
  options: [
    {
      name: "public",
      description: "Show the definition to everyone?",
      type: ApplicationCommandOptionType.Boolean,
      default: false,
    },
  ],
}

export const commands = {
  ping: PING_COMMAND,
  invite: INVITE_COMMAND,
  urban: URBAN_COMMAND,
  random: RANDOM_COMMAND,
} as const
