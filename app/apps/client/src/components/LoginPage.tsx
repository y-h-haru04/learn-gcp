import { Box, Button, Card, Typography } from "@mui/material";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

const LoginPage = () => {
  const onLoginClick = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  return (
    <Box sx={{ width: '100%', transform: 'translateY(-50%)', top: '50%', position: 'absolute', }}>
      <Card sx={{ width: '400px', margin: '0 auto', padding: '48px 16px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography component='h2' sx={{ fontSize: '24px' }}>ログイン</Typography>
          <Button className='emphasize' onClick={onLoginClick} variant='outlined' sx={{ marginTop: '16px' }}>Googleでログイン</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
