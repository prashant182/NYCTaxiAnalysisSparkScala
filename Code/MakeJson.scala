//Section for Importing the libraries
import org.apache.spark.{SparkConf, SparkContext, sql}
import org.apache.spark.SparkContext._
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.mllib.clustering.{GaussianMixture, GaussianMixtureModel}
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.sql.DataFrame
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.Row

object MakeJson{
    def main(args: Array[String]): Unit={
         val spark = new org.apache.spark.sql.SQLContext(sc)
        import spark.implicits._
        for(j<-0 to 23) {
        println("[")
        val gmmInitial = GaussianMixtureModel.load(sc, "hdfs://babar.es.its.nyu.edu:8020/user/jad752/project/jun/"+j+".csv//model")
        for(k<-0  to 4){
        println("\t{")
        println("\t\t\"sigma\":[")
        println("\t\t\t[")
        println("\t\t\t"+gmmInitial.gaussians(k).sigma.toArray(0)+",")
        println("\t\t\t"+gmmInitial.gaussians(k).sigma.toArray(1))
        println("\t\t\t],")
        println("\t\t\t[")
        println("\t\t\t"+gmmInitial.gaussians(k).sigma.toArray(2)+",")
        println("\t\t\t"+gmmInitial.gaussians(k).sigma.toArray(3))
        println("\t\t\t]")
        println("\t\t],")
        println("\t\t\"mag\":"+gmmInitial.weights(k)*5+",")
        println("\t\t\"coordinates\":[")
        println("\t\t"+gmmInitial.gaussians(k).mu.toArray(0)+",")
        println("\t\t"+gmmInitial.gaussians(k).mu.toArray(1))
        println("\t\t]")
        println("\t}")
        if(k!=4) {
          println(",")
        }
      }
      println("]")
      if(j!=23){
      println(",")
      }
    }
    }
}