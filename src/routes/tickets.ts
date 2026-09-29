import { Router } from 'express';
import {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicketStatus,
} from '../dal/tickets.js';
import authMiddleware from '../middleware/auth.js';
import {
    insertTimeLog,
    getTotalHoursForTicket,
} from '../dal/timeLogs.js';

const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
router.get('/', async (req, res) => {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const tickets = await getAllTickets({ limit, offset, status, });
    res.json(tickets);
});

// GET /tickets/:id
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const ticket = await getTicketById(id);

    if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
    }

    res.json(ticket);
});

// POST /tickets
router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const creator_id = res.locals.userId;

    const ticket = await createTicket({ creator_id, title, description, });
    res.status(201).json(ticket);
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    const ticket = await updateTicketStatus(id, status);

    if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
    }

    res.json(ticket);
});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
router.post('/:id/time', authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const { hours } = req.body;
    const user_id = res.locals.userId;

    const timeLog = await insertTimeLog(id, user_id, hours);
    res.status(201).json(timeLog);
});

// GET /tickets/:id/time
router.get('/:id/time', async (req, res) => {
    const id = Number(req.params.id);
    const totalHours = await getTotalHoursForTicket(id);
    
    res.json({
        ticket_id: id,
        total_hours: totalHours,
    });
});
export default router;
