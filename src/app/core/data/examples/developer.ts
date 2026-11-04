import type { ToolGuide } from '../tool-examples';
import REGEX_GUIDE from './regex-tester.json';

/**
 * Each example is executed against its component in developer.spec.ts. The
 * regex examples run against the real worker in tests/regex-worker.test.mjs,
 * which is why they live in JSON.
 */
export const DEVELOPER_GUIDES: Record<string, ToolGuide> = {
  'json-formatter': {
    examples: [
      {
        title: 'Pretty-print a minified API response',
        settings: '2 spaces',
        input: '{"name":"Ada","langs":["en","fr"],"active":true}',
        output: '{\n  "name": "Ada",\n  "langs": [\n    "en",\n    "fr"\n  ],\n  "active": true\n}',
        explanation: 'Only whitespace changes. Keys stay in their original order and values are copied exactly as written.',
      },
      {
        title: 'Sort keys without rounding a large number',
        settings: '2 spaces, Sort keys on',
        input: '{"b":1,"a":9007199254740993}',
        output: '{\n  "a": 9007199254740993,\n  "b": 1\n}',
        explanation: '9007199254740993 is larger than JavaScript can represent exactly; a formatter that parsed and re-serialised it would print 9007199254740992. This one copies the original digits.',
      },
    ],
    limitations: [
      'Input must be strict JSON. Comments, trailing commas and single quotes are rejected rather than repaired.',
      'Sorting orders keys alphabetically at every level, which changes the document order. Leave it off when order matters to a reader.',
      'Very large documents are limited by your device’s memory and can render slowly on phones.',
    ],
  },
  'json-validator': {
    examples: [
      {
        title: 'Confirm a config file is valid',
        settings: 'Default',
        input: '{"server":{"port":8080,"hosts":["a","b"]},"debug":false}',
        output: 'Valid JSON\nKeys: 4\nObjects: 2\nArrays: 1\nMax depth: 4',
        explanation: 'Keys counts every object member at every level: server, port, hosts and debug. Max depth counts each level down to the innermost values: the root, server, hosts and the strings inside it.',
      },
      {
        title: 'Locate a trailing comma',
        settings: 'Default',
        input: '{\n  "port": 8080,\n  "debug": false,\n}',
        output: 'Invalid JSON\nFirst problem at line 4, column 1',
        explanation: 'The error is reported where the parser gave up, which is the closing brace after the stray comma. The wording of the message comes from your browser and differs between Chrome, Firefox and Safari; the line and column do not.',
      },
    ],
    limitations: [
      'Validation checks syntax only. It does not check a JSON Schema, required fields or value types.',
      'Only the first error is reported, because a parser cannot reliably continue past it. Fix it and validate again.',
      'Duplicate keys are valid JSON syntax and are not flagged, although many parsers keep only the last one.',
    ],
  },
  'jwt-decoder': {
    examples: [
      {
        title: 'Read the claims in a token',
        settings: 'Default',
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTQyIiwicm9sZSI6ImVkaXRvciIsImV4cCI6MTc2NzIyNTYwMH0.sig',
        output: 'Header:\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\nPayload:\n{\n  "sub": "user-42",\n  "role": "editor",\n  "exp": 1767225600\n}',
        explanation: 'The header and payload are base64url-encoded JSON, so anyone holding the token can read them. The tool also shows exp as a date: 1767225600 is 1 January 2026, 00:00 UTC.',
      },
      {
        title: 'Paste a whole Authorization header',
        settings: 'Default',
        input: 'Bearer not-a-token',
        output: 'A JWT has at least two dot-separated segments. This does not look like one.',
        explanation: 'A leading “Bearer ” is removed automatically. What remains has no dots, so it cannot be a JWT, and the tool says so instead of guessing.',
      },
    ],
    limitations: [
      'The signature is not verified. A decoded token proves nothing about who issued it; only your server, holding the key, can check that.',
      'Encrypted tokens (JWE, five segments) cannot be read without the decryption key.',
      'Avoid pasting live production tokens into any website. Decoding here is local, but a token is a credential until it expires.',
    ],
  },
  'uuid-generator': {
    examples: [
      {
        title: 'Format a GUID for Windows or .NET',
        settings: 'Format: Braced GUID',
        input: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
        output: '{3F2504E0-4F89-41D3-9A0C-0305E82C3301}',
        explanation: 'Braced format uppercases the UUID and wraps it in braces, as the Windows registry and older .NET code expect. The value is the same 128-bit identifier.',
      },
      {
        title: 'Remove hyphens for a compact key',
        settings: 'Format: No hyphens',
        input: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
        output: '3f2504e04f8941d39a0c0305e82c3301',
        explanation: 'Some databases and URLs prefer the 32-character form. Hyphens are presentation only and carry no information.',
      },
    ],
    limitations: [
      'New IDs are random version 4 UUIDs from crypto.randomUUID. These examples apply formats to a fixed sample so the result is repeatable.',
      'Version 4 UUIDs are not sortable by time. Use a time-ordered scheme such as UUIDv7 if you need insertion order.',
      'UUIDs identify things; they are not secrets. Do not use them as passwords or session tokens on their own.',
    ],
  },
  'base64-encoder': {
    examples: [
      {
        title: 'Encode text with non-English characters',
        settings: 'Encode',
        input: 'Hello, wörld!',
        output: 'SGVsbG8sIHfDtnJsZCE=',
        explanation: 'Text is converted to UTF-8 bytes before encoding, so ö becomes two bytes. Tools that use btoa directly fail on characters like this.',
      },
      {
        title: 'Make Base64 safe for a URL',
        settings: 'Encode, URL-safe alphabet on',
        input: '<<???>>',
        output: 'PDw_Pz8-Pg',
        explanation: 'URL-safe Base64 replaces + with -, / with _ and drops the = padding, so the result can sit in a URL or filename without escaping. Standard Base64 for the same input is PDw/Pz8+Pg==.',
      },
    ],
    limitations: [
      'Base64 is an encoding, not encryption. Anyone can decode it.',
      'Encoded output is about a third larger than the input.',
      'Decoding expects the result to be UTF-8 text. Binary data such as images should go through Base64 to Image instead.',
    ],
  },
  'url-encoder': {
    examples: [
      {
        title: 'Encode a value for a query string',
        settings: 'Encode, Component',
        input: 'price=10&20 €',
        output: 'price%3D10%2620%20%E2%82%AC',
        explanation: 'Component mode escapes = and &, which would otherwise start a new parameter, and encodes € as its three UTF-8 bytes.',
      },
      {
        title: 'Decode a form-encoded value',
        settings: 'Decode, Component',
        input: 'q=caf%C3%A9+au+lait',
        output: 'q=café au lait',
        explanation: 'Form submissions encode spaces as +, so the decoder turns + back into spaces before resolving the percent escapes.',
      },
    ],
    limitations: [
      'Whole URL mode leaves reserved characters such as ?, & and / alone. Use Component mode for a single parameter value.',
      'Because + is decoded as a space, a literal plus sign must be sent as %2B.',
      'A malformed escape such as %E2%82 on its own cannot be decoded and is reported as an error.',
    ],
  },
  'html-entity-encoder': {
    examples: [
      {
        title: 'Show markup as text on a web page',
        settings: 'Encode',
        input: '<a href="x">Tom & Jerry</a>',
        output: '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;',
        explanation: 'The five characters with special meaning in HTML are escaped, so the browser displays the tag instead of creating a link.',
      },
      {
        title: 'Escape accented characters for an ASCII-only system',
        settings: 'Encode, Escape all non-ASCII on',
        input: 'Café ✓',
        output: 'Caf&#233; &#10003;',
        explanation: 'Every character above code 127 becomes a numeric entity, so the text survives systems that mangle UTF-8. A modern page served as UTF-8 does not need this.',
      },
    ],
    limitations: [
      'Escaping text for HTML content is not enough inside JavaScript, CSS or URL attributes, which have their own escaping rules.',
      'Decoding uses your browser’s HTML parser, so it understands every named entity, but the result is only ever read as text.',
      'This is not a sanitiser. Do not rely on it to make untrusted HTML safe to insert.',
    ],
  },
  'hash-generator': {
    examples: [
      {
        title: 'Hash a short string',
        settings: 'Text input',
        input: 'abc',
        output: 'SHA-1: a9993e364706816aba3e25717850c26c9cd0d89d\nSHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        explanation: 'These are the standard test vectors for “abc”, so you can use them to check another implementation. The same input always gives the same hash.',
      },
      {
        title: 'See how one character changes everything',
        settings: 'Text input',
        input: 'abd',
        output: 'SHA-1: cb4cc28df0fdbe0ecf9d9662e294b118092a5735\nSHA-256: a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9',
        explanation: 'Changing the last letter produces a completely different digest. That property is what makes a hash useful for detecting changed files.',
      },
    ],
    limitations: [
      'SHA-1 is broken for collision resistance. Use SHA-256 or stronger for anything security-related.',
      'Text is hashed as UTF-8 exactly as typed, including trailing spaces and line breaks. A copied value with a trailing newline gives a different hash.',
      'Do not store passwords as plain SHA hashes; use a slow password hash such as Argon2 or bcrypt on your server.',
    ],
  },
  'sql-formatter': {
    examples: [
      {
        title: 'Format a one-line query',
        settings: 'Format, 2 spaces',
        input: "select id, name from users where active = 1 and role = 'admin' order by name",
        output: 'SELECT id, name\nFROM users\nWHERE active = 1\nAND role = \'admin\'\nORDER BY name',
        explanation: 'Keywords are uppercased and each clause starts a new line. The string literal is left exactly as written.',
      },
      {
        title: 'Minify a query for a log line',
        settings: 'Minify',
        input: "SELECT id\nFROM   users\n-- only active\nWHERE  active = 1",
        output: 'SELECT id FROM users WHERE active = 1',
        explanation: 'Line breaks and repeated spaces collapse to single spaces, and the -- comment is removed, since on one line it would comment out everything after it.',
      },
    ],
    limitations: [
      'The formatter does not validate SQL. A query with a syntax error is formatted, not rejected.',
      'Vendor-specific syntax, such as PL/pgSQL blocks or T-SQL batches, is formatted as generic SQL and may need manual touch-ups.',
      'Identifiers are not re-cased, so a quoted "UserId" stays as written.',
    ],
  },
  'yaml-formatter': {
    examples: [
      {
        title: 'Convert a small config file to JSON',
        settings: 'YAML to JSON',
        input: 'server:\n  port: 8080\n  hosts:\n    - a.example.com\n    - b.example.com\ndebug: false',
        output: '{\n  "server": {\n    "port": 8080,\n    "hosts": [\n      "a.example.com",\n      "b.example.com"\n    ]\n  },\n  "debug": false\n}',
        explanation: 'Mappings become objects and sequences become arrays. Unquoted numbers and booleans become JSON numbers and booleans.',
      },
      {
        title: 'Convert JSON to YAML',
        settings: 'JSON to YAML',
        input: '{"name":"api","replicas":2,"ports":[80,443]}',
        output: 'name: api\nreplicas: 2\nports:\n  - 80\n  - 443',
        explanation: 'Each nesting level is indented by two spaces, the convention used by Kubernetes and most CI configuration.',
      },
    ],
    limitations: [
      'Anchors, aliases, custom tags and multiple documents in one file are reported as unsupported rather than guessed at.',
      'Comments are dropped when converting, because JSON has no comments.',
      'YAML treats unquoted values like yes, no and 1.0 as types in some parsers. Quote values that must stay strings.',
    ],
  },
  'cron-generator': {
    examples: [
      {
        title: 'Weekdays at 9 in the morning',
        settings: 'Five-field expression',
        input: '0 9 * * 1-5',
        output: 'At 09:00 on Monday, Tuesday, Wednesday, Thursday and Friday.',
        explanation: 'The fields are minute, hour, day of month, month and day of week. 1-5 means Monday to Friday.',
      },
      {
        title: 'Every 15 minutes',
        settings: 'Five-field expression',
        input: '*/15 * * * *',
        output: 'Every 15 minutes every day.',
        explanation: 'A step value such as */15 runs at minutes 0, 15, 30 and 45 of every hour.',
      },
    ],
    limitations: [
      'This is standard five-field Unix cron. Quartz, AWS EventBridge and some CI systems use six or seven fields and extra symbols such as ? and L.',
      'Next run times are shown in your local time zone. Most servers run cron in UTC, so check the server’s time zone.',
      'When both day of month and day of week are set, standard cron runs on days matching either one.',
    ],
  },
  'regex-tester': REGEX_GUIDE,
};
