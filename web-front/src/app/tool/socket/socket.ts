/*
 * Socket 导出
 *
 */
import * as io from 'socket.io-client'

export  const socket = io("http://127.0.0.1:3000/socket")

