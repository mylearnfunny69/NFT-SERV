// Google Workspace API helper client using OAuth Access Tokens

// 1. Sync NFTs to a new Google Sheets Spreadsheet
export async function syncNFTsToGoogleSheet(accessToken: string, nfts: any[]) {
  try {
    // Step A: Create a brand new Spreadsheet
    const createResponse = await fetch("https://sheets.googleapis.com/v1/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: `ChatMint.ai - My Tokenized Bitcoin NFTs (${new Date().toLocaleDateString()})`,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Sheets creation failed: ${errorText}`);
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const spreadsheetUrl = spreadsheet.spreadsheetUrl;

    // Step B: Define the header rows and rows of NFT data
    const values = [
      ["Serial Token ID", "Title", "Conceptual Description", "Creator Wallet Address", "Theme Design", "Likes", "Tx Hash", "Anchor Block", "Published Date"],
    ];

    nfts.forEach((nft) => {
      values.push([
        nft.tokenSerial || "",
        nft.title || "",
        nft.description || "",
        nft.creatorAddress || "",
        nft.themeId || "",
        String(nft.likes || 1),
        nft.txHash || "",
        String(nft.blockNumber || ""),
        new Date(nft.createdAt).toLocaleString(),
      ]);
    });

    // Step C: Write values to Sheet1!A1
    const writeResponse = await fetch(
      `https://sheets.googleapis.com/v1/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!writeResponse.ok) {
      throw new Error("Failed to populate Google Sheet rows.");
    }

    return { spreadsheetId, spreadsheetUrl };
  } catch (err) {
    console.error("syncNFTsToGoogleSheet error:", err);
    throw err;
  }
}

// 2. Create a Google Task for reviewing/managing the newly minted NFT
export async function createGoogleTaskForNFT(accessToken: string, nftTitle: string, description: string) {
  try {
    const response = await fetch("https://tasks.googleapis.com/v1/lists/@default/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Review ChatMint NFT: ${nftTitle}`,
        notes: `Analyze performance, manage bid bids, and celebrate this tokenized dialogue concept.\n\nDescription: ${description}`,
        due: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // due in 1 day
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Google Task.");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("createGoogleTaskForNFT error:", err);
    throw err;
  }
}

// 3. Schedule a Celebration Event on Google Calendar
export async function scheduleCalendarCelebration(accessToken: string, nftTitle: string) {
  try {
    const startTime = new Date(Date.now() + 30 * 60 * 1000); // starts in 30 minutes
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 mins duration

    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `🎉 Celebrate ChatMint NFT: ${nftTitle}`,
        description: `Successfully compiled ChatGPT dialogue and minted a 1/1 SIP-009 collectible NFT on Bitcoin L2 (Stacks blockchain)! Show it off in the global registry registry.`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        },
        colorId: "11", // Bold Bold Grape/Purple
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Calendar Event.");
    }

    const data = await response.json();
    return data.htmlLink;
  } catch (err) {
    console.error("scheduleCalendarCelebration error:", err);
    throw err;
  }
}

// 4. Create an automatic user Feedback Google Form for this NFT
export async function createFeedbackGoogleForm(accessToken: string, nftTitle: string) {
  try {
    // Step A: Create a Form
    const createResponse = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: {
          title: `Feedback: "${nftTitle}" Bitcoin L2 NFT`,
          documentTitle: `ChatMint - Feedback: ${nftTitle}`,
        },
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create Google Form.");
    }

    const form = await createResponse.json();
    const formId = form.formId;
    const responderUri = form.responderUri;

    // Step B: Add feedback questions to the Form
    const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            createItem: {
              item: {
                title: "How would you rate the design theme border for this chat log NFT?",
                questionItem: {
                  question: {
                    required: true,
                    choiceQuestion: {
                      type: "RADIO",
                      options: [
                        { value: "5 - Exceptional masterwork" },
                        { value: "4 - Highly polished Web3 styling" },
                        { value: "3 - Standard quality" },
                        { value: "2 - Needs aesthetic work" },
                        { value: "1 - Unremarkable" },
                      ],
                    },
                  },
                },
              },
              location: { index: 0 },
            },
          },
          {
            createItem: {
              item: {
                title: "Would you place a bid (in STX tokens) on this dialog idea?",
                questionItem: {
                  question: {
                    required: true,
                    choiceQuestion: {
                      type: "RADIO",
                      options: [
                        { value: "Yes, definitely!" },
                        { value: "Maybe, if the price is right" },
                        { value: "No, purely archival interest" },
                      ],
                    },
                  },
                },
              },
              location: { index: 1 },
            },
          },
          {
            createItem: {
              item: {
                title: "Any general comments or improvement ideas for the developer?",
                questionItem: {
                  question: {
                    required: false,
                    textQuestion: { paragraph: true },
                  },
                },
              },
              location: { index: 2 },
            },
          },
        ],
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to add questions to Google Form.");
    }

    return { formId, responderUri };
  } catch (err) {
    console.error("createFeedbackGoogleForm error:", err);
    throw err;
  }
}
