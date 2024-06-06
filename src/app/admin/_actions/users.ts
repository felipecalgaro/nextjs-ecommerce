"use server";

import prisma from "@/db/prisma";
import { notFound } from "next/navigation";

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: { id },
  });

  if (user == null) return notFound();

  return user;
}
