/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    "intro",
    {
      type: "category",
      label: "How Aztec Works",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Privacy",
          link: {
            type: "doc",
            id: "how-aztec-works/privacy",
          },
          items: ["how-aztec-works/privacy-sets"],
        },
        "how-aztec-works/scalability",
        {
          type: "category",
          label: "Aztec Connect",
          link: {
            type: "doc",
            id: "how-aztec-works/aztec-connect/aztec-connect",
          },
          items: ["how-aztec-works/aztec-connect/technical-intro"],
        },
        "how-aztec-works/accounts",
        "how-aztec-works/tokens",
        "how-aztec-works/talks-videos",
        "how-aztec-works/faq",
      ],
    },
    {
      type: "category",
      label: "Developers",
      items: [
        "developers/getting-started",
        "developers/cli",
        {
          type: "category",
          label: "Aztec Connect Bridges",
          items: [
            "developers/bridges/bridges",
            "developers/bridges/subsidy",
            "developers/bridges/dataprovider",
          ],
        },
        "developers/local-devnet",
        "developers/deposit",
        "developers/transaction-model",
        "developers/sequencer-api",
        "developers/mainnet-info",
        "developers/noir",
      ],
    },
    {
      type: "category",
      label: "SDK",
      link: {
        type: "generated-index",
      },
      items: [
        "sdk/overview",
        {
          type: "category",
          label: "Usage",
          link: {
            type: "generated-index",
          },
          items: [
            "sdk/usage/setup",
            "sdk/usage/add-account",
            "sdk/usage/register",
            "sdk/usage/add-spending-keys",
            "sdk/usage/account-recovery",
            "sdk/usage/deposit",
            "sdk/usage/transfer",
            "sdk/usage/withdraw",
            "sdk/usage/ethereum-interaction",
            "sdk/usage/feecontroller",
          ],
        },
        {
          type: "category",
          label: "Types, Classes, Interfaces",
          link: {
            type: "generated-index",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "sdk/types",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Technical Specification",
      items: [
        "spec/SUMMARY",
        "spec/intro",
        {
          type: "category",
          label: "General",
          items: [
            "spec/primitives",
            {
              type: "doc",
              id: "spec/schnorr",
              label: "Schnorr Signatures",
            },
            "spec/schnorr_multisig",
            {
              type: "doc",
              id: "spec/uint",
              label: "Unsigned Integers",
            },
            "spec/notes_and_nullifiers",
            "spec/defi_bridge_interface",
          ],
        },
        {
          type: "category",
          label: "'App' Circuits",
          items: [
            "spec/account_circuit",
            "spec/join_split_circuit",
            "spec/claim_circuit",
          ],
        },
        {
          type: "category",
          label: "Rollup Circuits",
          items: [
            "spec/rollup_circuit",
            "spec/root_rollup_circuit",
            "spec/root_verifier_circuit",
          ],
        },
        "spec/rollup_contract",
      ],
    },
    "compliance",
    "glossary",
  ],
  zkmoneySidebar: [
    "zk-money/userguide",
    "zk-money/fees",
    "zk-money/assetvaluation",
    "zk-money/troubleshooting",
    "zk-money/june2021update",
  ],
};

module.exports = sidebars;
