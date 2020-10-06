<?php
    /* Template name: Contact */

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
            <div class="row">
                <div class="col-12">
                    <?php
                        if (!empty(get_the_content())) {
                            ?>
                            <div class="text">
                                <?php the_content(); ?>
                            </div>
                            <?php
                        }
                    ?>

                    <?php
                        // foreach ($section_extras as $form) {
                            ?>
                            <form class="form form--contact">
                                <div class="form__group form__group--ifl">
                                    <label class="form__label"><?php // echo $form->email->label->$lang; ?></label>
                                    <input type="email" class="form__input form__input--email" id="contact-email" name="contact-email" maxlength="128" placeholder="<?php // echo $form->email->placeholder->$lang; ?>" required>
                                </div>
                                <div class="form__group form__group--ifl">
                                    <label class="form__label"><?php // echo $form->subject->label->$lang; ?></label>
                                    <input type="text" class="form__input form__input--text" id="contact-subject" name="contact-subject" maxlength="128" placeholder="<?php // echo $form->subject->placeholder->$lang; ?>" required>
                                </div>
                                <div class="form__group form__group--ifl">
                                    <label class="form__label"><?php // echo $form->message->label->$lang; ?></label>
                                    <textarea class="form__input form__input--textarea" id="contact-message" name="contact-message" placeholder="<?php // echo $form->message->placeholder->$lang; ?>" rows="8" required></textarea>
                                </div>
                                <div class="form__group form__group--mt-big">
                                    <button type="submit" class="btn btn--primary"><?php // echo $form->submit->label->$lang; ?></button>
                                </div>
                            </form>
                            <?php
                        // }
                    ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
