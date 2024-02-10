import type { PageServerLoad, Actions } from './$types';

import { message, superValidate } from 'sveltekit-superforms';

import { zod } from "sveltekit-superforms/adapters";

import { formSchema, notesSchema } from '$lib/schema';

const error = { success: false, text: "<div class=\"inline-block\">Something went wrong. <a href=\"/add\" style=\"text-decoration-line: underline;\">Please try again.</a>" };

export const load = (async () => {
    const webForm = await superValidate(zod(formSchema));
    const notesForm = await superValidate(zod(notesSchema));
    return { form: webForm, notes: notesForm };
}) satisfies PageServerLoad;

export const actions = {
    form: async ({ request }) => {
        const form = await superValidate(request, zod(formSchema));
        
        if (!form.valid) {
            return message(form, error);
        }

        const req = await fetch("http://api:8080/add-pkm", {
             body: JSON.stringify(form),
             method: "POST",
	         headers: { "Content-Type": "application/json" },
	         mode: "no-cors"
         });

         const resp = req.status;
         if (resp != 200) {
             return message(form, error);
         }

        return message(form, { success: true, text: "Pokémon Successfully Added!" });
    },

    notes: async ({ request }) => {
        const form = await superValidate(request, zod(notesSchema));

        if (!form.valid) {
            return message(form, error);
        }

        const req = await fetch("http://api:8080/add-notes", {
            body: JSON.stringify(form),
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors"
        });

        const resp = req.status;
        if (resp != 200) {
            return message(form, error);
        }

        return message(form, { success: true, text: "Notes Successfully Added!" })
    }
} satisfies Actions;