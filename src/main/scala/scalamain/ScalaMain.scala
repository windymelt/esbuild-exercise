package scalamain

import scala.scalajs.js
import scala.scalajs.js.annotation._

object Main {
  @JSExportTopLevel("fib", moduleID = "scalamain")
  def fib(n: Int): Int = {
    if (n <= 1) n
    else fib(n - 1) + fib(n - 2)
  }

  @JSExportTopLevel("fact", moduleID = "scalamain")
  def fact(n: Int): Int = {
    if (n <= 1) 1
    else n * fact(n - 1)
  }

  @JSExportTopLevel("map", moduleID = "scalamain")
  def map(f: js.Function1[Int, Int], list: js.Array[Int]): js.Array[Int] = {
    list.map(f)
  }

  @JSExportTopLevel("filter", moduleID = "scalamain")
  def filter(f: js.Function1[Int, Boolean], list: js.Array[Int]): js.Array[Int] = {
    list.filter(f)
  }
}
