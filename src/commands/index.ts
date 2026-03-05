import { Command } from "commander";
import { setLogLevel } from "../utils/logger";
import { registerAnalyzeCommand } from "./analyze.command";
import { registerExecuteCommand } from "./execute.command";
import { registerOptimizeCommand } from "./optimize.command";
import { registerRunCommand } from "./run.command";
import type { CommandContext } from "./types";

export function registerCommands(program: Command, context: CommandContext): void {
  setLogLevel(context.config.logLevel);

  registerOptimizeCommand(program, context);
  registerAnalyzeCommand(program, context);
  registerExecuteCommand(program, context);
  registerRunCommand(program, context);
}
