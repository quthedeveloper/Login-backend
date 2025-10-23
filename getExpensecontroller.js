const userData = require('./UserFinanceSchema');


const getExpensePage = async(req, res) => {
const { user } = req;
const page = Number(req.query.page); 
const limit = Number(req.query.limit);

try{
    const existingUser = await userData.findOne({ Email:user });
    if(!existingUser){
        return res.status(404).json({message: "No entries from user"});
    }
    const entries = existingUser.Expenses;
    
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
catch(err){
    if(err){
        res.status(500).json({message: "server is down at the moment"});
    }
}
}

module.exports = getExpensePage