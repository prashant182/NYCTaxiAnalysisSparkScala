import org.apache.spark.sql.SQLContext
import org.apache.spark.{SparkConf, SparkContext, sql}
import org.apache.spark.sql.functions.unix_timestamp
import org.apache.spark.sql.functions.{to_date, unix_timestamp}
import org.apache.spark.sql.functions.unix_timestamp
import scala.reflect.internal.util.TableDef.Column
/**
  * Created by jatri on 5/3/2017.
  */
object CleanData {
  def main(args: Array[String]): Unit = {
 
    //val conf = new SparkConf().setAppName("Simple Application").setMaster("local[*]")
   // val sc = new SparkContext(conf)
    val spark = new org.apache.spark.sql.SQLContext(sc)
    //import spark.implicits._
    val data = readDate(spark,"hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/yellow_tripdata_2016-06.csv")
    val dataClean = cleanData(spark,data)
    val dateConvertedData = fixDateFields(spark,dataClean,"yyyy-mm-dd hh:mm:ss")
    val dataSplitted = splitData(spark,dateConvertedData)
    for (i<-23 to 23){
      dataSplitted(i).write.csv("hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/jun/"+i+".csv")
    }
  }
 
  def splitData(spark:SQLContext,data: sql.DataFrame): Array[sql.DataFrame]={
    val dataBlocks = new Array[sql.DataFrame](24)
    data.createOrReplaceTempView("data")
    for(i<-23 until(24)){
     dataBlocks(i)=spark.sql("SELECT * FROM data WHERE hour(tpep_pickup_datetime)=="+i)
    }
    return dataBlocks
  }
  def readDate(spark: SQLContext, path: String) : sql.DataFrame={
    val greenData = spark.read.format("csv").option("header", "true").load(path)
    return greenData
  }
 
  def cleanData(spark:SQLContext,data:sql.DataFrame ):sql.DataFrame={
    val DataFiltered = data.select("tpep_pickup_datetime", "tpep_dropoff_datetime", "Pickup_longitude", "Pickup_latitude", "Dropoff_longitude", "Dropoff_latitude", "Trip_distance", "Total_amount")
    DataFiltered.createOrReplaceTempView("DataFiltered")
    val DataCleaned = spark.sql("select * from DataFiltered where Pickup_longitude <> 0 and Pickup_latitude <> 0 and Trip_distance <> 0 and Total_amount <> 0 and Dropoff_longitude <> 0 and Dropoff_latitude <> 0")
    return DataCleaned
  }
 
  def fixDateFields(spark: SQLContext,data:sql.DataFrame,format :String):sql.DataFrame={
    import spark.implicits._
    val pickUpTime = unix_timestamp($"tpep_pickup_datetime",format).cast("timestamp")
    val DropOffTime = unix_timestamp($"tpep_dropoff_datetime",format).cast("timestamp")
    data.withColumn("tpep_pickup_datetime",pickUpTime)
    data.withColumn("tpep_dropoff_datetime",pickUpTime)
    return data
 
  }
}