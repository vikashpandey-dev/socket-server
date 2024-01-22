const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = [];

const adduser = (userid, socketid) => {
  console.log(userid);
  !users.some((user) => user.userid === userid) &&
    users.push({ userid, socketid });
};
const removueruser = (socketid) => {
  users = users.filter((user) => user.socketid !== socketid);
};
const checkuser=(socketid)=>{
return users.find((user)=>user.userid==socketid.receiverId)
}
io.on("connection", (socket) => {
  socket.on("addUser", (userid) => {
    adduser(userid, socket.id);
    io.emit("getUser", users);
  });

socket.on("sendMessage",(Message)=>{
    console.log(Message,socket.id)
   let user= checkuser(Message)
  if(user){
    io.to(user.socketid).emit("getMessage",Message)
  }
 
})
  socket.on("disconnect", () => {
    removueruser(socket.id);
    io.emit("getUser", users);
  });
});

