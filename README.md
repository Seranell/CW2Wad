Installation guide
1. Git clone https://github.com/Seranell/CW2Wad.git
2. cd CW2Wad
3. npm i
4. node index

   Nodemon is installed however do not use this!!! This will cause the server to repeatedly add items to the databases and you cannot access the website as a result due to the constant changes.

   If an error appears indication that the databases are more than 10% corrupt, delete the database files, upon starting the server again these databases will recover with the original items initialised by the database, however it will not recover items created through the website
