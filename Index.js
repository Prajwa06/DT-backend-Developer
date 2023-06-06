require("dotenv").config();
const express = require('express');
const mongoose=require("mongoose");
const cors=require("cors");
const app = express();
const date=new Date()
const port=3000;
const bodyParser = require('body-parser');
app.use(cors());
app.use(express.json());
const Event=require("./EventModel");
const username = "prajwaljadhav051";
const password = encodeURIComponent(process.env.password);


// Middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.5bkkvap.mongodb.net/`
  );

  const db = mongoose.connection;
  // check connection status
  db.once("open", () => { 
    console.log("Db is connected");
  });



//Gets an event by its unique id
app.get('/api/v3/app/events', (req,res)=>{
    const eventId = req.query.id;
  const event = events.find(e => e.id === parseInt(eventId));

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
});


//Gets an event by its recency & paginate results by page number and limit of events per page
app.get('/api/v3/app/events', (req, res) => {
    const { type, limit, page } = req.query;
    let filteredEvents = events;
  
    // Filter events based on recency (latest first)
    if (type === 'latest') {
      filteredEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  
    // Pagination
    const pageSize = parseInt(limit) || 5;
    const currentPage = parseInt(page) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  
    res.json({
      paginatedEvents
    });
  });


  //// POST request to create an event
app.post('/api/v3/app/events', async (req, res) => {
    const {
      name,
      tagline,
      schedule,
      description,
      files,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;

    console.log(req.body);
  
    const event = new Event({
      name,
      tagline,
      schedule,
      description,
      files,
      moderator,
      category,
      sub_category,
      rigor_rank,
    });
  
    try {
      const savedEvent = await event.save();
      res.json({ id: savedEvent._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });



  // PUT request to update an event
app.put('/api/v3/app/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const {
      name,
      tagline,
      schedule,
      description,
      files,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;
  
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        {
          name,
          tagline,
          schedule,
          description,
          files,
          moderator,
          category,
          sub_category,
          rigor_rank,
        },
        { new: true }
      );
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json({ id: event._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  });


  // DELETE request to delete an event
app.delete('/api/v3/app/events/:id', async (req, res) => {
    const eventId = req.params.id;
  
    try {
      const event = await Event.findByIdAndDelete(eventId);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json({ id: eventId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });









































app.listen(port, ()=>{
    console.log("Server is running on port "+port+ "on "+date.toLocaleString() );
})