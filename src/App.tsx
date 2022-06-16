import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useMachine } from "@xstate/react";
import { wakeUpMachine } from "./wakeup.machine";

const todoURL = "https://jsonplaceholder.typicode.com/todos";

type Todos = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

async function getOneTodo(todoNumber: number) {
  return fetch(`${todoURL}/${todoNumber}`)
    .then((r) => r.json())
    .then((res: Todos) => res);
}

function App() {
  const [wakeUpState, send] = useMachine(wakeUpMachine, {
    services: {
      getTodosFromDb: async (ctx, evt) => {
        return await getOneTodo(ctx.numberOfTimesSnoozed);
      },
    },
  });
  console.log("wakeUpState:", wakeUpState);

  const { numberOfTimesSnoozed, cash, todo } = wakeUpState.context;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Current state: {wakeUpState.value}</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>You have snoozed {numberOfTimesSnoozed} times</p>
        {wakeUpState.matches("sleeping") && (
          <>
            <button onClick={() => send("GENTLE_ALARM")}>
              Gentle soothing alarm
            </button>
            <button onClick={() => send("FIRE_ALARM")}>WAKE UP NOW</button>
          </>
        )}
        {wakeUpState.matches("wakingUp") && (
          <button onClick={() => send("SNOOZE")}>One more minute mom</button>
        )}
        {wakeUpState.matches("wideAwake") && (
          <button
            onClick={() =>
              send({
                type: "Day is over now",
                moneyBroughtHome: Math.random() * 1000,
              })
            }
          >
            Go back home{" "}
          </button>
        )}
        <p>Bringing in the benjis {cash}</p>
        <pre>{JSON.stringify(todo ?? {}, undefined, 4)}</pre>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </p>
      </header>
    </div>
  );
}

export default App;
