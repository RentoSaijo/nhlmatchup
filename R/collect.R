# Load libraries.
library(nhlscraper)
library(httr)
library(rsvg)
library(magick)
library(tools)
suppressMessages(library(tidyverse))

# Set helpers.
get_team_logos <- function() {
  teams <- get_teams() %>% 
    filter(triCode!='ARI')
  tri_codes <- unique(teams$triCode)
  paths <- c()
  teams <- c()
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
      teams <- append(teams, tri_code)
    }, error=function(e) {})
  }
  return(data.frame(teams, paths))
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
teams <- get_team_logos()
square_image(teams$paths)
teams <- teams %>% 
  filter(teams!='NHL')
teams <- teams$teams
