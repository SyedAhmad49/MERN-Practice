import Link from "next/link";

export default function Home() {
  return (
    <main style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh"}}>
      <Link href="/posts" style={{color:"#0642f8"}}>
        Posts
      </Link>
    </main>
  );
}
