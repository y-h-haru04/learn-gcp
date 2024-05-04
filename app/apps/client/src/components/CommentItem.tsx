import { Box, ListItem, Typography } from '@mui/material'
import CircleAvatar from './CircleAvatar';

type Props = {
  icon: string;
  userName: string;
  postedAt: string
  content: string;
}

const CommentItem = ({ icon, userName, postedAt, content }: Props) => {
  return (
    <ListItem sx={{ display: 'flex' }}>
      <Box sx={{ paddingRight: '8px' }}>
        <CircleAvatar icon={icon} name={userName} /> 
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <strong>{userName}</strong>
          <small>{postedAt}</small>
        </Box>
        <Typography component="div">
          {content} 
        </Typography>
      </Box>
    </ListItem>
  )
}

export default CommentItem