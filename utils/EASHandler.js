import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export default class EASHandler {
  static EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // Base Goerli
  static schemaUID = "0x11fb32126da1d35918fc58921fae7f06178d66d67f1db0d2d20724daf82c14c0";

  static init(safeAuth) {
    this.safeAuth = safeAuth;
  }

  static async attestData(DistanceWalked, inputType, inputDate) {
    // const provider = new ethers.providers.Web3Provider(this.safeAuth.getProvider());

    console.log("eas contract address: " + this.EASContractAddress);
    const eas = new EAS(this.EASContractAddress);

    console.log("created new eas: " + JSON.stringify(eas, null, 2));

    // const prov = ethers.providers.getDefaultProvider("goerli");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("uint16 DistanceWalked,string Type,string Date");
    const encodedData = schemaEncoder.encodeData([
      { name: "DistanceWalked", value: DistanceWalked, type: "uint16" },
      { name: "Type", value: inputType, type: "string" },
      { name: "Date", value: inputDate, type: "string" }
    ]);

    const tx = await eas.attest({
      name: "",
      schema: this.schemaUID,
      data: {
        revocable: false,
        data: encodedData
      }
    });

    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);

    return newAttestationUID;
  }

  static async getAttestation(uid) {
    const provider = new ethers.providers.Web3Provider(this.safeAuth.getProvider());
    eas.connect(provider);

    const attestation = await eas.getAttestation(uid);

    console.log("retreived: " + attestation);
  }
}
