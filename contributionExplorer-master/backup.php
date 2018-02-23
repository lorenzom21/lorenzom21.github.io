<?php

$dbh;
try 
{
    /*** connect to SQLite database ***/

    $dbh = new PDO("sqlite:db/contrib.db");

}
catch(PDOException $e)
{
    echo $e->getMessage();
    echo "<br><br>Database -- NOT -- loaded successfully .. ";
    die( "<br><br>Query Closed !!! $error");
}
$search = htmlspecialchars($_GET["name"]);
#$query =  "SELECT * from CandsCRP12 WHERE FirstLastP LIKE '%$search%'";
$query = "SELECT * from CandsCRP12 WHERE CurrCand = 'Y' AND DistIDRunFor = 'PRES'";
header('Content-type: text/plain; charset=us-ascii');
$i=0;
$line="";
echo "["; 

foreach ($dbh->query($query) as $row) {
	echo "{";
	echo "\"candidateName\": \"".$row["FirstLastP"]."\",";
	echo "\"CID \": \"".$row["CID"]."\",";
	echo "\"Party\": \"".$row["Party"]."\",";
	echo "\"ranFor\": \"".$row["DistIDRunFor"]."\",";
	echo "\"currentPosition\": \"".$row["DistIDCurr"]."\",";
	echo "\"type\": \"".$row["CRPICO"]."\",";
	echo "\"noPacs\": \"".$row["noPacs"]."\",";
	$query2 = "SELECT distinct(RealCode), FECCandID from PACs12 WHERE FECCandID = '".$row["FECCandID"]."'";
	echo "\"PACs\":[";
	foreach ($dbh->query($query2) as $row2) {
		$query3 = "SELECT sum(Amount) as Amount, RealCode from PACs12 where RealCode = '".$row2["RealCode"]."' AND FECCandID = '".$row2["FECCandID"]."'";
		$name;
		$amount;
		foreach ($dbh->query($query3) as $row3) {
			$name = $row3["RealCode"];
			$amount = $row3["Amount"]
		}
		echo "\"".$name."\":".$amount.",";
	}
	echo "]";
 	$i=$i+1;
 	$line="";
 	echo "},";
}
echo "]";
?>