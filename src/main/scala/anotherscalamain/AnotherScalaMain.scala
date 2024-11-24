package anotherscalamain

import scala.scalajs.js
import scala.scalajs.js.annotation._

object AnotherScalaMain {
  @JSExportTopLevel("hello", moduleID = "anotherscalamain")
  def hello(name: String): String = {
    s"Hello, $name!"
  }
}
