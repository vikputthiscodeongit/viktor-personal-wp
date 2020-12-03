<?php
    /* Template name: Website settings */

    get_header();
?>

<?php
    $site_settings = get_field("website_settings");
    // var_dump($site_settings);
?>
<section class="site-section">
    <div class="container">
        <?php
            $title = get_the_title();
            if (!empty($title)) {
                ?>
                <div class="title">
                    <h1>
                        <?php echo $title; ?>
                    </h1>
                </div>
                <?php
            }
        ?>

        <ul class="site-settings" aria-label="<?php echo $site_settings["label"]; ?>">
            <li class="site-settings__item">
                <label for="setting-dark-theme"><?php echo $site_settings["dark_theme"];?></label>
                <input type="checkbox" class="toggle" id="setting-dark-theme">
            </li>

            <li class="site-settings__item">
                <label for="setting-reduced-motion"><?php echo $site_settings["reduced_motion"];?></label>
                <input type="checkbox" class="toggle" id="setting-reduced-motion">
            </li>

            <li class="site-settings__item">
                <label for="setting-increased-contrast"><?php echo $site_settings["increased_contrast"];?></label>
                <input type="checkbox" class="toggle" id="setting-increased-contrast">
            </li>

            <li class="site-settings__item">
                <label for="setting-site-header-auto-hide"><?php echo $site_settings["site_header_auto_hide"];?></label>
                <input type="checkbox" class="toggle" id="setting-site-header-auto-hide">
            </li>

            <li class="site-settings__item">
                <label for="setting-dark-theme"><?php echo $site_settings["lang_select"];?></label>
                <span>LANGUAGE SWITCHER</span>
            </li>
        </ul>

        <div>
            <!-- Get title of page "website information". -->
        </div>
    </div>
</section>

<?php get_footer(); ?>
