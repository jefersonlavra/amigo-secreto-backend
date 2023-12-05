import { Router } from "express";
import * as events from "../controllers/events";
import * as groups from "../controllers/groups";
import * as peoples from "../controllers/peoples";

const router = Router();

router.get('/ping', (req, res) => res.json({ pong: true }));

router.get('/events/:id', events.getEvent);
router.get('/events/:id_event/search', peoples.searchPerson);

export default router;