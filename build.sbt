import org.scalajs.linker.interface.ModuleSplitStyle

val scala3Version = "3.5.2"

lazy val root = project
  .in(file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    name         := "esbuild-exercise",
    version      := "0.1.0-SNAPSHOT",
    scalaVersion := scala3Version,
    scalaJSLinkerConfig ~= {
      _.withModuleKind(ModuleKind.ESModule)
        .withModuleSplitStyle(ModuleSplitStyle.SmallModulesFor(List("scalamain")))
    },
  )
