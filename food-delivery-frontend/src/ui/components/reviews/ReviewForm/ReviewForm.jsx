import React, {useState} from 'react';
import {Box, Button, Rating, TextField} from "@mui/material";

const ReviewForm = ({onSubmit}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const handle = (e) => { e.preventDefault(); onSubmit({rating, comment: comment.trim() || undefined}); setComment(""); };
  return (
    <Box component="form" onSubmit={handle} sx={{display:'grid', gap:1, mt:1}}>
      <Rating value={rating} onChange={(_,v)=> setRating(v)} max={5}/>
      <TextField multiline minRows={2} label="Comment (optional)" value={comment} onChange={(e)=> setComment(e.target.value)}/>
      <Button type="submit" variant="contained">Submit review</Button>
    </Box>
  )
}
export default ReviewForm;
