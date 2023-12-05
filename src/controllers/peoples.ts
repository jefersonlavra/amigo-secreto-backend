import { RequestHandler } from "express";
import * as peoples from "../services/peoples";
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const items = await peoples.getAll({ id_event: parseInt(id_event), id_group: parseInt(id_group) });
    if (items) return res.json({ peoples: items });
    res.json({ error: 'Ocorreu um erro' });
};

export const getPerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const personItem = await peoples.getOne({ id: parseInt(id), id_event: parseInt(id_event), id_group: parseInt(id_group) });
    if (personItem) return res.json({ peoples: personItem });
    res.json({ error: 'Ocorreu um erro' });
};

export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const AddPersonSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, "")),
    });

    const body = AddPersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos" });


    const newPerson = await peoples.add({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });

    if (newPerson) return res.status(201).json({ peoples: newPerson });
    res.json({ error: 'Ocorreu um erro' });
};

export const updatePerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const UpdatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, "")).optional(),
        matched: z.string().optional()
    });

    const body = UpdatePersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos" });

    const updatedPerson = await peoples.update({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    }, body.data);

    if (updatedPerson) {
        const personItem = await peoples.getOne({ id: parseInt(id), id_event: parseInt(id_event) });
        return res.json({ peoples: personItem })
    };

    res.json({ error: 'Ocorreu um erro' });
};

export const deletePerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const deletedPerson = await peoples.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });

    if (deletedPerson) return res.json({ peoples: deletedPerson });

    res.json({ error: 'Ocorreu um erro' });
};

export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const SearchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ""))
    });

    const query = SearchPersonSchema.safeParse(req.query);
    if (!query.success) return res.json({ error: "Dados inválidos" });

    const personItem = await peoples.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf
    });

    if (personItem && personItem.matched) {
        const matchedId = decryptMatch(personItem.matched);
        const personMatched = await peoples.getOne({
            id_event: parseInt(id_event),
            id: matchedId
        });

        if (personMatched) {
            return res.json({
                person: {
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched: {
                    id: personMatched.id,
                    name: personMatched.name
                }
            });
        }
    }

    res.json({ error: 'Ocorreu um erro' });
};
