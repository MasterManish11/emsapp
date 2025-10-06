import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate =true

async function checkInternetConnectivity() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    return response.ok;
  } catch (error) {
    return false;
  }
}
export async function GET() {
  try {
    const isOnline = await checkInternetConnectivity();

    if (!isOnline) {
      return NextResponse.json({ message: "Internet is not working" });
    }
    const sql = `SELECT * FROM u967600739_E_meter.delta_em_RUN where Slave=1` 
    const users = await query({
      query: sql,
      values: [],
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "error" });
  }
}