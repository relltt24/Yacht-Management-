// Minimal firebase stub to satisfy imports during build
// Create this file at src/firebase/index.ts to resolve imports like '../../firebase'

const auth: any = { __stub: true, message: "firebase stub - install firebase to use real implementation" };
const firestore: any = { __stub: true };
const storage: any = { __stub: true };

export { auth, firestore, storage };
export default { auth, firestore, storage };