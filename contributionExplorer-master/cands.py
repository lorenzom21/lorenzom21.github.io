import csv
import sqlite3

db=sqlite3.connect("contrib.db")
cursor = db.cursor()

reader = csv.reader(open('cands12.csv'), delimiter='|')
row=reader.next()
for row in reader:
	sql = "INSERT INTO `CandsCRP12` ('Cycle','FECCandID','CID','FirstLastP','Party','DistIDRunFor','DistIDCurr','CurrCand','CycleCand','CRPICO','RecipCode','NoPacs') VALUES (?,?,?,?,?,?,?,?,?,?,?,?);"
	cursor.execute (sql, (row[0], row[1], row[2], row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11]))
	db.commit()
	print('| '.join(row))
db.close()