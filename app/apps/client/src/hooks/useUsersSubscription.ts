import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { User } from "../@types"
import { firestore } from "../firebase"

const useUsersSubscription = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const q = query(collection(firestore, 'users'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newUsers: User[] = []
      snapshot.forEach((doc) => {
        const data = doc.data();
        newUsers.push({
          ...data,
          id: doc.id,
        } as User);
      })
      setUsers(newUsers)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  return {
    users,
  }
}

export default useUsersSubscription;