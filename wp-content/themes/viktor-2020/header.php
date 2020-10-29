<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
  <head>
    <!--

    __/\\\\\\\\\\\\\\\_______/\\\\\____________________/\\\\\\\\\\\\__/\\\\\\\\\\\\\\\__/\\\________/\\\__/\\\\\\\\\\\__/\\\________/\\\_____/\\\\\\\\\\\____/\\\\\\\\\\\\\\\_
     _\////////////\\\______/\\\///\\\________________/\\\//////////__\/\\\///////////__\/\\\_______\/\\\_\/////\\\///__\/\\\_____/\\\//____/\\\/////////\\\_\///////\\\/////__
      ___________/\\\/_____/\\\/__\///\\\_____________/\\\_____________\/\\\_____________\//\\\______/\\\______\/\\\_____\/\\\__/\\\//______\//\\\______\///________\/\\\_______
       _________/\\\/______/\\\______\//\\\___________\/\\\____/\\\\\\\_\/\\\\\\\\\\\______\//\\\____/\\\_______\/\\\_____\/\\\\\\//\\\_______\////\\\_______________\/\\\_______
        _______/\\\/_______\/\\\_______\/\\\___________\/\\\___\/////\\\_\/\\\///////________\//\\\__/\\\________\/\\\_____\/\\\//_\//\\\_________\////\\\____________\/\\\_______
         _____/\\\/_________\//\\\______/\\\____________\/\\\_______\/\\\_\/\\\________________\//\\\/\\\_________\/\\\_____\/\\\____\//\\\___________\////\\\_________\/\\\_______
          ___/\\\/____________\///\\\__/\\\______________\/\\\_______\/\\\_\/\\\_________________\//\\\\\__________\/\\\_____\/\\\_____\//\\\___/\\\______\//\\\________\/\\\_______
           __/\\\\\\\\\\\\\\\____\///\\\\\/_______________\//\\\\\\\\\\\\/__\/\\\\\\\\\\\\\\\______\//\\\________/\\\\\\\\\\\_\/\\\______\//\\\_\///\\\\\\\\\\\/_________\/\\\_______
            _\///////////////_______\/////__________________\////////////____\///////////////________\///________\///////////__\///________\///____\///////////___________\///________

    -->

    <!-- The licenses for files originally created by 3rd parties can be found in their respective directories in /dist. -->

    <!-- Required meta tags -->
    <meta charset="<?php bloginfo("charset"); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Required site assets -->
    <?php wp_head(); ?>

    <!-- Favicon stuff -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo THEME_DIR; ?>/dist/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo THEME_DIR; ?>/dist/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo THEME_DIR; ?>/dist/favicon/favicon-16x16.png">
    <link rel="manifest" href="<?php echo THEME_DIR; ?>/dist/favicon/site.webmanifest">
    <link rel="mask-icon" href="<?php echo THEME_DIR; ?>/dist/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
  </head>

  <?php
      $strings = get_field("options", "options")["strings"];
      // var_dump($strings);
  ?>

  <body <?php body_class(); ?>>
    <div class="alert">
        <p></p>
    </div>

    <header class="site-header" id="site-header">
        <div class="site-menu">
            <?php
                $items_wrap = !empty($strings["pages"]) ? '<ul id="%1$s" class="site-navigation__buttons" aria-label="' . esc_attr($strings['pages']) . '">%3$s</ul>' : '<ul id="%1$s" class="site-navigation__buttons">%3$s</ul>';
                wp_nav_menu(array(
                    "menu" => "site_header",
                    "container" => "nav",
                    "container_class" => "site-navigation",
                    "walker" => new Viktor_2020(),
                    "items_wrap" => $items_wrap
                ));
            ?>
        </div>
    </header>

    <main class="site-main">
