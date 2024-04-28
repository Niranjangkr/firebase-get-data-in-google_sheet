# Firebase datastore json data copying to spreadsheet in proper rows and colums 

*Further this will help in migration from firebase to supabase*

***Requirements****
- get the json file of all the collections data from firestore using below command  
```npx -p node-firestore-import-export firestore-export -a <<FIREBASE_JSON_KEY>> -b backup.json```

- with the above command you will get all the data of all collections from your firestore and will be stored in backup.json file

- once you get that use json foramtter tool to format the data

- *** Make a new node project ***
- create data.json file and paste the formated data
- in this project you will see index.js file and extract_names.js 
- extract_names.js is a utiliy file you can use to extract the identifier like email or name
- main in index.js where all the writing to the spreadsheet is done
- make sure you create a new spreadsheet and copy its id to use in project and 
- make a new google cloud project and enable spreadsheet api and  make service account and copy the credentials to use here to authenticate the spreadsheet libraries
- and you'r good to go...  

