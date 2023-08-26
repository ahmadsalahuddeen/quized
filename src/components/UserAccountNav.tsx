import React from 'react'
import { User } from '@prisma/client'

type Props = {
  user : User
}

const UserAccountNav = ({user}: Props) => {
  return (
    <div>UserAccountNav</div>
  )
}

export default UserAccountNav