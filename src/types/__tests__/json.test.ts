import { Json } from "../json";

// Test object
const testJson: Json = {
  string: "test",
  number: 123,
  boolean: true,
  null: null,
  array: [1, "two", false],
  nested: {
    key: "value"
  }
};

// TypeScript will catch any type errors here
console.log("JSON type test passed:", testJson);