const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3

const main = async () => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SolanaProgram;
  const tx = await program.rpc.initialize();

  console.log("📝 Your transaction signature", tx);

  // const provider = anchor.Provider.env()
  // anchor.setProvider(provider);

  // const program = anchor.workspace.SolanaProgram;

  // const baseAccount = anchor.web3.Keypair.generate()

  // const tx = await program.rpc.initialize({
  //   accounts: {
  //     baseAccount: baseAccount.publicKey,
  //     user: provider.wallet.publicKey,
  //     systemProgram: SystemProgram.programId
  //   },
  //   signers: [baseAccount]
  // });

  // console.log("📝 Your transaction signature", tx);

  // let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  // console.log('👀 GIF Count', account.totalGifs.toString())

  // await program.rpc.addGif('https://media.giphy.com/media/J6Cyt2sk4TEYo978Ur/giphy.gif', {
  //   accounts: {
  //     baseAccount: baseAccount.publicKey,
  //     user: provider.wallet.publicKey
  //   }
  // })

  // account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  // console.log('👀 GIF Count', account.totalGifs.toString())
  // console.log('👀 GIF Count', account.gifList)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();