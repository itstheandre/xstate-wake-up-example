// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    oneMoreTime: "SNOOZE";
    updateTodo: "done.invoke.wake-up.wideAwake:invocation[0]";
    bringInTheDollas: "Day is over now";
  };
  internalEvents: {
    "done.invoke.wake-up.wideAwake:invocation[0]": {
      type: "done.invoke.wake-up.wideAwake:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.after(3000)#wake-up.wakingUp": {
      type: "xstate.after(3000)#wake-up.wakingUp";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    getTodosFromDb: "done.invoke.wake-up.wideAwake:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: "getTodosFromDb";
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    getTodosFromDb: "FIRE_ALARM" | "xstate.after(3000)#wake-up.wakingUp";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "sleeping" | "wakingUp" | "wideAwake";
  tags: never;
}
