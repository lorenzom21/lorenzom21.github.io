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
$num1 = 0;
foreach ($dbh->query($query) as $row) {
	if ($num1 > 0) {
		echo ",";
	}
	$num1 += 1;
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
	$map = array(
		"Agribusiness"=> 0, 
		"Candidate"=> 0, 
		"Communic/Electronics"=> 0, 
		"Construction"=> 0, 
		"Defense"=>0, 
		"Energy/Nat Resource"=> 0,
		"Finance/Insur/RealEst"=> 0 , 
		"Health"=> 0, 
		"Ideology/Single-Issue"=> 0, 
		"Joint Candidate Cmtes"=> 0, 
		"Labor"=> 0, 
		"Lawyers & Lobbyists"=> 0, 
		"Misc Business"=> 0, 
		"Non-contribution"=> 0, 
		"Other"=> 0, 
		"Party Cmte"=> 0,
		"Transportation"=> 0, 
		"Unknown"=>0);
	foreach ($dbh->query($query2) as $row2) {
		$query3 = "SELECT sum(Amount) as Amount, RealCode from PACs12 where RealCode = '".$row2["RealCode"]."' AND FECCandID = '".$row2["FECCandID"]."'";
		$name;
		$amount;
		foreach ($dbh->query($query3) as $row3) {
			
			$amount = $row3["Amount"];
		}
		
		$query3 = "SELECT sectorlong from categories where catcode = '".$row2["RealCode"]."'";
		foreach ($dbh->query($query3) as $row3) {
			$name = $row3["sectorlong"];
		}
		$map[$name] += $amount;
		//echo "\"".$name."\":".$map[$name].",";
	}
	$num = 0;
	if ($map["Agribusiness"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Agribusiness"."\":".$map["Agribusiness"]."}";
	}
	if ($map["Candidate"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Candidate"."\":".$map["Candidate"]."}";
	}
	if ($map["Communic/Electronics"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Communic/Electronics"."\":".$map["Communic/Electronics"]."}";
	}
	if ($map["Construction"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Construction"."\":".$map["Construction"]."}";
	}
	if ($map["Defense"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Defense"."\":".$map["Defense"]."}";
	}
	if ($map["Energy/Nat Resource"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Energy/Nat Resource"."\":".$map["Energy/Nat Resource"]."}";
	}
	if ($map["Finance/Insur/RealEst"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Finance/Insur/RealEst"."\":".$map["Finance/Insur/RealEst"]."}";
	}
	if ($map["Health"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Health"."\":".$map["Health"]."}";
	}
	if ($map["Ideology/Single-Issue"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Ideology/Single-Issue"."\":".$map["Ideology/Single-Issue"]."}";
	}
	if (($map["Joint Candidate Cmtes"] + $map["Party Cmte"])  > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Committee"."\":".($map["Joint Candidate Cmtes"] + $map["Party Cmte"])."}";
	}
	if (($map["Other"] + $map["Unknown"])  > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Other"."\":".($map["Other"] + $map["Unknown"])."}";
	}
	if ($map["Labor"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Labor"."\":".$map["Labor"]."}";
	}
	if ($map["Lawyers & Lobbyists"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Lawyers & Lobbyists"."\":".$map["Lawyers & Lobbyists"]."}";
	}
	if ($map["Misc Business"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Misc Business"."\":".$map["Misc Business"]."}";
	}
	if ($map["Non-contribution"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Non-contribution"."\":".$map["Non-contribution"]."}";
	}
	if ($map["Transportation"] > 0) {
		if ($num > 0) {
			echo ",";
		}
		$num += 1;
		echo "{\""."Transportation"."\":".$map["Transportation"]."}";
	}
	echo "]";
 	$i=$i+1;
 	$line="";
 	echo "}";
}
echo "]";
?>