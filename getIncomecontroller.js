const userData = require('./UserFinanceSchema');

//use pagination here
const getallIncome = async(req, res) => {
const { user } = req;
const page = Number(req.query.page); // for instance 3
const limit = Number(req.query.limit);// for instance 10

try{

const existingUser = await userData.findOne({ Email:user });
if(!existingUser){
    return res.status(404).json({message: "No entries from user"});
}
const entries = existingUser.Income;

if(entries.length === 0){
    return res.status(404).json({message: "no inputs made"});
}

const totalPages = Math.ceil(entries.length / limit);
let pages = [];
for(let i = 1; i <= totalPages; i++){
    pages = [...pages, i]
}

const beginning = (page * limit) - limit;
const ending = page * limit - 1; 

const filteredEntries = entries.filter((_, i)=>{
    return i >= beginning && i <= ending;
})

res.status(200).json({
    Entries: filteredEntries, // for entries
    totalEntries: pages, // for pages
    TotalDocs: entries.length // for length of the whole entries array of user 
})

}
catch{
   return res.status(500).json({message: "server error"});
}
}


module.exports = getallIncome;