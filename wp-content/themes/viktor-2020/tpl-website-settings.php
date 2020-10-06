<?php
    /* Template name: Website settings */

    get_header();
?>

<?php
    $site_settings_strings = $strings["site_settings"];
    // var_dump($site_settings_strings);
?>
<section class="section">
    <div class="container">
        <div class="section__header">
            <?php
                $title = get_the_title();
                if (!empty($title)) {
                    ?>
                    <div class="row">
                        <div class="col-12">
                            <div class="title title--main">
                                <h1>
                                    <?php echo $title; ?>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            ?>
        </div>

        <div class="row">
            <div class="col-12">
                <ul class="site-settings" aria-label="<?php echo $site_settings_strings["self"]; ?>">
                    <li class="site-settings__item">
                        <label for="setting-theme"><?php echo $site_settings_strings["theme"]["self"];?></label>
                        <button type="button" class="toggle" id="setting-theme" data-string-light="<?php echo $site_settings_strings["theme"]["light"]; ?>" data-string-dark="<?php echo $site_settings_strings["theme"]["dark"]; ?>">
                        </button>
                    </li>

                    <li class="site-settings__item">
                        <button type="button" class="toggle" id="setting-reduced-motion">
                            <?php echo $site_settings_strings["reduced_motion"]; ?>
                        </button>
                    </li>

                    <li class="site-settings__item">
                        <button type="button" class="toggle" id="setting-increased-contrast">
                            <?php echo $site_settings_strings["increased_contrast"]; ?>
                        </button>
                    </li>

                    <li class="site-settings__item">
                        <button type="button" class="toggle" id="setting-site-header-auto-hide">
                            <?php echo $site_settings_strings["site_header_auto_hide"]; ?>
                        </button>
                    </li>

                    <li class="site-settings__item">
                        <span><?php echo $site_settings_strings["language_select"]; ?></span>

                        <ul class="lang-select">
                            <li class="lang-select__item">
                                <span>
                                    Nederlands
                                </span>
                            </li>

                            <li class="lang-select__item">
                                <a href="#" target="_self">
                                    English
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <!-- Get title of page "website information". -->
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
