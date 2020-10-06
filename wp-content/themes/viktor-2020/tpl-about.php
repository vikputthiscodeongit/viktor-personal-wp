<?php
    /* Template name: About */

    get_header();
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
                            <div class="title">
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

        <div class="section__body">
            <?php
                if (has_post_thumbnail()) {
                    ?>
                    <div class="row">
                        <div class="col-12">
                            <div class="media">
                                <figure>
                                    <?php echo get_the_post_thumbnail(); ?>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            ?>

            <?php
                if (!empty(get_the_content())) {
                    ?>
                    <div class="row">
                        <div class="col-12">
                            <div class="text">
                                <?php the_content(); ?>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
