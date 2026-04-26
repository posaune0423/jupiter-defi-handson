import { assert, assertStringIncludes } from "@std/assert";

async function readWorkspaceFile(name: string): Promise<string> {
  return await Deno.readTextFile(new URL(`../${name}`, import.meta.url));
}

Deno.test("OpenClaw prompts state the agent can run approved workspace Deno tasks", async () => {
  const [agents, soul, actions] = await Promise.all([
    readWorkspaceFile("AGENTS.md"),
    readWorkspaceFile("SOUL.md"),
    readWorkspaceFile("ACTIONS.md"),
  ]);

  assertStringIncludes(agents, "You can run local commands");
  assertStringIncludes(agents, "deno task swap:execute");
  assertStringIncludes(agents, "Do not ask the human to run demo commands");
  assertStringIncludes(soul, "Do not say you lack local execution permission");
  assertStringIncludes(soul, "run `deno task wallet` yourself");
  assertStringIncludes(actions, "Intent Router");
  assertStringIncludes(actions, "Supported Executable Actions");
  assertStringIncludes(actions, "--output-amount 1");
  assertStringIncludes(actions, "Unsupported Or Not Yet Implemented Actions");
  assert(
    ![agents, actions].some((text) => text.includes("deno task swap -- --")),
    "Deno task examples must not pass an extra -- positional argument",
  );
});
