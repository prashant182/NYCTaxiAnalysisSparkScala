import org.apache.hadoop.hive.ql.security.authorization.plugin.sqlstd.GrantPrivAuthUtils
import org.apache.spark.{SparkConf, SparkContext, sql}
import org.apache.spark.SparkContext._
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.mllib.clustering.{GaussianMixture, GaussianMixtureModel}
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.sql.DataFrame
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.Row

object TrainModel {
  def main(args: Array[String]): Unit = {
    //val conf = new SparkConf().setAppName("Simple Application").setMaster("local[*]")
    //val sc = new SparkContext(conf)
    val spark = new org.apache.spark.sql.SQLContext(sc)
    import spark.implicits._
    for(i<-23 to 23) {
      val data = spark.read.format("csv").option("header", "false").load("hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/jun/"+i+".csv/*.csv")
      val gmmDataTrain = data.select("_c2", "_c3")
      val gmmData= gmmDataTrain.rdd
      val gmmSkipped = gmmData.mapPartitionsWithIndex{(idx, iter) => if (idx == 0) iter.drop(1) else iter}
      val gmmConvertedRdd = gmmSkipped.map({case Row(str:java.lang.String,str2:java.lang.String)=>Row(str.toDouble,str2.toDouble)})
      val rdd=gmmConvertedRdd.map(row=>Vectors.dense( row.getDouble(0).toDouble,row.getDouble(1).toDouble))
      val gmm = new GaussianMixture().setK(5).run(rdd)
      gmm.save(sc,"hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/jun/"+i+".csv/model")
    }
}
}