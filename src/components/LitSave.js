import * as LitJsSdk from "lit-js-sdk";
import { create } from "ipfs-http-client";

export default function LitSave() {
  const chain = "ethereum";
  const accessControlConditionsAddress = [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0xe5C7681CAb39ea3005DC31fBc844000e1Aa65ffD",
      },
      permanant: false,
    },
  ];

  const clientIpfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const litProcess = async () => {
    //encryptAll

    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    const litNodeClient = client;
    console.log("connected");

    var authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: chain,
    });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      "ciaociaociao"
    );

    console.log("encryptedString");
    console.log(encryptedString);
    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsAddress,
      symmetricKey,
      authSig,
      chain,
    });

    console.log("encryptedString");
    console.log(encryptedString);
    console.log("encryptedSimmetricKey");
    console.log(encryptedSymmetricKey);

    const result = await clientIpfs.add(
      JSON.stringify({
        version: "1.0.0",
        encryptedString: encryptedString,
      })
    );
    console.log(result);
    const path = result.path;
    console.log(path);

    //decryptAll

    const urlToFetch = "https://ipfs.infura.io/ipfs/" + path;
    let resUrl, dataIpfs;
    await fetch(urlToFetch).then((res) => (resUrl = res.url));
    await fetch(resUrl).then(async (data) => (dataIpfs = await data.json()));
    console.log(dataIpfs);

    const toDecrypt = await LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      "base16"
    );
    const decryptedSymmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditionsAddress,
      toDecrypt: toDecrypt,
      chain,
      authSig,
    });
    console.log(decryptedSymmetricKey);
    console.log(encryptedString);
    const blob = new Blob([dataIpfs.encryptedString]);
    console.log(blob);
    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      decryptedSymmetricKey
    );

    console.log(decryptedString);
  };

  litProcess();

  return (
    <>
      <p>Ciao</p>
    </>
  );
}
