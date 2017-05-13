object CalculatePickups{
    def main(args: Array[String]): Unit={
        val spark = new org.apache.spark.sql.SQLContext(sc)
        import spark.implicits._
        for(j<-0 to 23) {
        val data = spark.read.format("csv").option("header", "true").load("hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/jun/"+j+".csv/*.csv")
        println(data.count())   
    }
}
}
