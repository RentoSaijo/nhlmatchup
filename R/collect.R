# Load libraries.
library(nhlscraper)
library(httr)
library(rsvg)
library(magick)
library(tools)

# Set helpers.
get_team_logos <- function() {
  tri_codes <- get_teams()$triCode
  paths <- c()
  for (tri_code in tri_codes) {
    tryCatch({
      url <- sprintf(
        'https://assets.nhle.com/logos/nhl/svg/%s_light.svg', 
        tri_code
      )
      svg <- content(GET(url), 'raw')
      png <- rsvg_png(svg)
      path <- sprintf('assets/logos_original/%s.png', tri_code)
      writeBin(png, path)
      paths <- append(paths, path)
    }, error=function(e) {})
  }
  return(paths)
}
square_image <- function(paths) {
  DIRECTORY_OUT='assets/logos_squared'
  SIZE=1000
  BACKGROUND='none'
  dir.create(DIRECTORY_OUT, showWarnings=FALSE, recursive=TRUE)
  for (path in paths) {
    image <- image_read(path)
    info <- image_info(image)[1, ]
    side <- max(info$width, info$height)
    image_squared <- image_extent(
      image,
      geometry=sprintf('%sx%s', side, side),
      color=BACKGROUND,
      gravity='center'
    )
    image_scaled <- image_resize(image_squared, sprintf('%sx%s', SIZE, SIZE))
    base <- file_path_sans_ext(basename(path))
    image_write(
      image_scaled, 
      file.path(DIRECTORY_OUT, paste0(base, '.png')), 
      format='png'
    )
  }
  invisible(TRUE)
}

# Get team logos.
paths <- get_team_logos()
square_image(paths)
