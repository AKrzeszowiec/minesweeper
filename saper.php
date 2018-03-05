<!DOCTYPE html>
<html>

<head>
   
</head>
<body>
    <?php
//receiving nick and time
        $nick=$_GET['nick']; 
        $time=floatval($_GET['time']);
        $skillLevel=$_GET['skillLevel'];
//opening connection to database
        $link=mysql_connect('localhost'); 
        if (!$link) {
            die('Nie można się połaczyć: ' . mysql_error());
        }
        $db_selected = mysql_select_db('saper', $link);
        if (!$db_selected) {
            die ('Can\'t use saper : ' . mysql_error());
        }

//adding game result to database
        $sql="INSERT INTO ".$skillLevel." (nick, gametime) VALUES ('".$nick."',".$time.")";
        mysql_query($sql);

//we want to keep track of only 10 results
        $sql="SELECT COUNT(*) FROM ".$skillLevel;
        $record_nr=mysql_result(mysql_query($sql),0);
        while ($record_nr>10) {
            $deletion="DELETE FROM ".$skillLevel." WHERE gametime ORDER BY gametime DESC LIMIT 1";
            mysql_query($deletion);
        }

//printing the results to our site
        $sql="SELECT * FROM ".$skillLevel." ORDER BY gametime";
        $result=mysql_query($sql);
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
            printf ("Nick: %s  Score: %s <br>", $row[0], $row[1]);  
        }
        mysql_close($link);
        
    ?>
</body>
    
</html>