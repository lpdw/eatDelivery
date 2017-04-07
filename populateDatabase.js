var sqlite3         =       require('sqlite3').verbose();
var db              =       new sqlite3.Database('./Commands.db');

//Perform INSERT operation.
db.run("INSERT into Commands(id_command,address,delivery_date,delivery_progress,progress_update_date,error,error_descripion) VALUES ('ER78LKHD56FGH','20 RUE DU TEST',2017-04-07,NULL,NULL,NULL,NULL)");
