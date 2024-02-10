import { z } from "zod";

export const formSchema = z.object({
    generation: z.number().min(1, "Generation must be between 1 and 9").max(9, "Generation must be between 1 and 9").default(1),
    game: z.string({ message: "Selected game is invalid" }).default("red"),
    trainerGender: z.string({ message: "Selected gender is invalid" }),
    trainerNickName: z.string({ message: "Trainer nickname is invalid" }),
    trainerID: z.number({ message: "Trainer ID must be between 0 and 999999" }).min(0).max(999999),
    species: z.number({ message: "Selected species is invalid" }),
    level: z.number({ message: "Level must be between 1 and 100" }).min(1).max(100),
    isShiny: z.boolean().default(false),
    metDate: z.date({ message: "Selected date is invalid" }),
    metLocation: z.string({  message: "Selected location is invalid" }),
    evHp: z.number({ message: "HP is invalid" }),
    evAttack: z.number({ message: "Attack is invalid" }),
    evDefense: z.number({ message: "Defense is invalid" }),
    evSpeed: z.number({ message: "Speed is invalid" }),
    evSpecial: z.number({ message: "Special is invalid" }).nullish(),
    evSpecDef: z.number({ message: "Spec. Defense is invalid" }).nullish(),
    evSpecAtk: z.number({ message: "Spec. Attack is invalid" }).nullish(),
    moves: z.string().array().min(1, "At least one move must be selected").max(4, "No more than 4 moves can be given"),
    additionalNotes: z.string().nullish()
});

export const notesSchema = z.object({
    notes: z.string({ message: "Please type something... Anything..." })
});