import express, {Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  // res.status(200).send("Hello Norld")
  res.render('index', { title: "Hello", message: "There" })
})

app.listen(PORT, () => {
  console.log('listening...')
}).on('error', (e) => {
  throw new Error(e.message)
})